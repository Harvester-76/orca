package expo.modules.orcamobilewebshell

import android.webkit.WebView
import androidx.webkit.ScriptHandler
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature

/** Runs the app's script in the shell page before its own; null when document-start scripts are unsupported. */
internal fun installMobileWebShellDocumentScript(
  webView: WebView,
  allowedOrigin: String,
  script: String
): ScriptHandler? {
  if (script.isEmpty() || !WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
    return null
  }
  return runCatching {
    WebViewCompat.addDocumentStartJavaScript(webView, script, setOf(allowedOrigin))
  }.getOrNull()
}
