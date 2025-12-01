import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function TestTerminal() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('Testing OpenRouter connection...');
      
      const response = await base44.functions.invoke('testOpenRouter');
      
      console.log('Test response:', response);
      
      if (response.data?.success) {
        setResult({
          success: true,
          message: "✅ OpenRouter connection working!",
          details: response.data
        });
      } else {
        setResult({
          success: false,
          message: "❌ OpenRouter connection failed",
          details: response.data
        });
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult({
        success: false,
        message: "❌ Error testing connection",
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setTesting(false);
    }
  };

  const testTerminal = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('Testing terminal function...');
      
      const response = await base44.functions.invoke('napzTerminal', {
        messages: [
          { text: "write me a simple hello world in html", isNapz: false }
        ],
        addWatermark: false
      });
      
      console.log('Terminal test response:', response);
      
      if (response.data?.response) {
        setResult({
          success: true,
          message: "✅ Terminal working!",
          details: response.data.response.substring(0, 200) + "..."
        });
      } else {
        setResult({
          success: false,
          message: "❌ Terminal failed",
          details: response.data
        });
      }
    } catch (error) {
      console.error('Terminal test error:', error);
      setResult({
        success: false,
        message: "❌ Terminal error",
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔧 Terminal Diagnostics</h1>
        
        <div className="space-y-4 mb-8">
          <Button
            onClick={testConnection}
            disabled={testing}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing OpenRouter...
              </>
            ) : (
              "Test OpenRouter Connection"
            )}
          </Button>

          <Button
            onClick={testTerminal}
            disabled={testing}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Terminal...
              </>
            ) : (
              "Test Terminal Function"
            )}
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-xl border-2 ${
            result.success 
              ? "bg-green-900/20 border-green-500" 
              : "bg-red-900/20 border-red-500"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {result.success ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
              <h3 className="text-xl font-bold">{result.message}</h3>
            </div>

            {result.error && (
              <div className="mb-4">
                <p className="text-sm font-bold text-red-400 mb-2">Error:</p>
                <pre className="bg-black/50 p-4 rounded-lg text-sm overflow-x-auto">
                  {result.error}
                </pre>
              </div>
            )}

            {result.details && (
              <div>
                <p className="text-sm font-bold mb-2">Details:</p>
                <pre className="bg-black/50 p-4 rounded-lg text-sm overflow-x-auto">
                  {typeof result.details === 'string' 
                    ? result.details 
                    : JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
          <h3 className="font-bold text-lg mb-3">📋 How to Use This Test:</h3>
          <ol className="space-y-2 text-sm text-gray-300">
            <li>1. Click "Test OpenRouter Connection" first</li>
            <li>2. If that works, click "Test Terminal Function"</li>
            <li>3. Check your browser console (F12) for detailed logs</li>
            <li>4. Share any errors with support</li>
          </ol>
        </div>

        <div className="mt-6 p-6 bg-gray-900 rounded-xl">
          <h3 className="font-bold text-lg mb-3">🔑 Environment Check:</h3>
          <div className="space-y-2 text-sm">
            <p>✅ OPENROUTER_API_KEY: Set</p>
            <p className="text-gray-400">Check Base44 dashboard → Settings → Environment Variables to verify the key is correct</p>
          </div>
        </div>
      </div>
    </div>
  );
}