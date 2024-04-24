package by.wanna.sample

import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.util.Base64
import android.webkit.JavascriptInterface
import androidx.core.content.FileProvider
import java.io.File


class ShareScreenshotJSInterface(private val context: Context) {

    @JavascriptInterface
    fun getBase64FromBlobData(base64Data: String) {
        convertBase64StringToImageAndShareIt(base64Data)
    }

    private fun convertBase64StringToImageAndShareIt(base64: String) {
        val imageFolder = File(context.cacheDir, "images")
        imageFolder.mkdirs()
        val bytes: ByteArray = Base64.decode(
            base64.replaceFirst("data:image/png;base64,", ""),
            Base64.DEFAULT
        )
        val imageFile = File(imageFolder, "screenshot.png")
        imageFile.writeBytes(bytes)

        val uriToShare =
            FileProvider.getUriForFile(context, "by.wanna.sample.fileprovider", imageFile)
        val intent = Intent(Intent.ACTION_SEND)
        val mimeType = "image/png"
        intent.clipData = ClipData(
            "A label describing your screenshot to the user",
            arrayOf(mimeType),
            ClipData.Item(uriToShare)
        )
        intent.putExtra(Intent.EXTRA_STREAM, uriToShare)
        intent.type = mimeType
        intent.flags = Intent.FLAG_GRANT_READ_URI_PERMISSION;
        context.startActivity(Intent.createChooser(intent, "Share via"))
    }

    companion object {
        fun getBase64StringFromBlobUrl(blobUrl: String): String {
            return if (blobUrl.startsWith("blob")) {
                "javascript: var xhr = new XMLHttpRequest();" +
                        "xhr.open('GET', '" + blobUrl + "', true);" +
                        "xhr.setRequestHeader('Content-type','image/png');" +
                        "xhr.responseType = 'blob';" +
                        "xhr.onload = function(e) {" +
                        "    if (this.status == 200) {" +
                        "        var blob = this.response;" +
                        "        var reader = new FileReader();" +
                        "        reader.readAsDataURL(blob);" +
                        "        reader.onloadend = function() {" +
                        "            base64data = reader.result;" +
                        "            Android.getBase64FromBlobData(base64data);" +
                        "        }" +
                        "    }" +
                        "};" +
                        "xhr.send();"
            } else "javascript: console.log('It is not a Blob URL');"
        }
    }
}