package by.wanna.sample

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private val permissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted: Boolean ->
        if (isGranted) {
            // You can use the API that requires the permission.
            startSdk()
        } else {
            // Explain to the user that the feature is unavailable because the
            // feature requires a permission that the user has denied. At the
            // same time, respect the user's decision. Don't link to system
            // settings in an effort to convince the user to change their
            // decision.
                Toast.makeText(
                    this,
                    "Can't use sdk without camera permission",
                    Toast.LENGTH_SHORT
                ).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        findViewById<Button>(R.id.tryOnButton).setOnClickListener {
            requestPermission()
        }
    }

    private fun requestPermission() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
                // You can use the API that requires the permission.
                startSdk()
            }
            shouldShowRequestPermissionRationale(Manifest.permission.CAMERA) -> {
                // In an educational UI, explain to the user why your app requires this
                // permission for a specific feature to behave as expected, and what
                // features are disabled if it's declined. In this UI, include a
                // "cancel" or "no thanks" button that lets the user continue
                // using your app without granting the permission.
                Toast.makeText(this, "Sdk requires camera permission", Toast.LENGTH_SHORT).show()
            }
            else -> {
                permissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }

    private fun startSdk() {
        startActivity(Intent(this, WebViewActivity::class.java))
    }
}