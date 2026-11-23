#!/usr/bin/env python3
"""
=============================================================================
 AgroVision AI - Local Exhibition Server (Python 3)
 Asaan Python server jo school exhibition aur computer lab mein chal sakta hai.
=============================================================================
 How to run:
   python3 server.py
 Open in browser:
   http://localhost:8000
=============================================================================
"""

import http.server
import socketserver
import os
import sys

# Port number for the exhibition presentation
PORT = 8000

# Set current directory as web directory
web_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(web_dir)

class AgroVisionHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow cross-origin access and prevent caching during live presentation
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    print("=" * 65)
    print(" 🍅 AgroVision AI - Plant Disease Detection (School Edition)")
    print(" Built for STEAM Exhibition 2026: Safe & Clean Agriculture")
    print("=" * 65)
    print(f" [+] Serving files from: {web_dir}")
    print(f" [+] Server running at : http://localhost:{PORT}")
    print(" [+] Press Ctrl+C to stop the server.")
    print("=" * 65)

    # Allow port reuse to avoid 'Address already in use' errors
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("", PORT), AgroVisionHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Server stopped by user. Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    main()
