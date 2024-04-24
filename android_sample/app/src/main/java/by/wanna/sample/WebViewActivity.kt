package by.wanna.sample

import android.os.Bundle
import android.os.PersistableBundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

private const val SAMPLE_URL = "https://webar.wanna.fashion/watch/"

class WebViewActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webview)
        this.webView = findViewById<WebView>(R.id.webview)
        this.webView.settings.javaScriptEnabled = true

        // If you wanna test version with sneakers please use this link
        // https://webar.wanna.fashion/sneakers/
        if (savedInstanceState == null) {
          // Prevent opening in a new window
          this.webView.webViewClient = WebViewClient()
          this.webView.loadUrl(SAMPLE_URL)
        }
        this.webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }
        this.webView.settings.allowFileAccess = true
        this.webView.addJavascriptInterface(ShareScreenshotJSInterface(this), "Android")
        this.webView.setDownloadListener { url, t1, t2, t3, t4 ->
          this.webView.loadUrl(ShareScreenshotJSInterface.getBase64StringFromBlobUrl(url))
        }
    }

  override fun onSaveInstanceState(outState: Bundle, outPersistentState: PersistableBundle) {
    super.onSaveInstanceState(outState, outPersistentState)
    this.webView.saveState(outState)
  }

  override fun onRestoreInstanceState(
    savedInstanceState: Bundle?,
    persistentState: PersistableBundle?
  ) {
    super.onRestoreInstanceState(savedInstanceState, persistentState)
    if (savedInstanceState != null) {
      this.webView.restoreState(savedInstanceState)
    }
  }
}
