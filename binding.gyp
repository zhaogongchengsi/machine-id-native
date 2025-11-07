{
  "targets": [
    {
      "target_name": "machine_id_native",
      "sources": [
        "src/addon.cpp",
        "src/machine_id.h",
        "src/machine_fingerprint.h",
        "src/machine_fingerprint_native.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        [ "OS=='mac'", { 
          "sources": [ "src/machine_id_mac.cpp" ],
          "xcode_settings": {
            "OTHER_CFLAGS": [ "-ObjC++" ]
          },
          "link_settings": {
            "libraries": [
              "-framework CoreFoundation",
              "-framework IOKit"
            ]
          }
        } ],
        [ "OS=='win'", { 
          "sources": [ "src/machine_id_win.cpp" ],
          "libraries": [ "wbemuuid.lib" ]
        } ],
        [ "OS=='linux'", { "sources": [ "src/machine_id_linux.cpp" ] } ]
      ]
    }
  ]
}
