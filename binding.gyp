{
  'targets': [{
    'target_name': 'native',
    'include_dirs': [
      "<!(node -e \"require('napi-macros')\")"
    ],
    'sources': ['./src/native/index.c'],
    'conditions': [
      ['OS=="linux"', {
        'cflags': [ '-std=c99', '-Wpedantic' ],
        'cflags_cc': [ '-std=c++17', '-Wpedantic' ],
      }],
      ['OS=="win"', {
        'msvs_settings': {
          'VCCLCompilerTool': {
            'AdditionalOptions': [ '/std:c++17' ]
          }
        },
      }],
      ['OS=="mac"', {
        'xcode_settings': {
          # Minimum mac osx target version (matches node v16.14.2)
          'MACOSX_DEPLOYMENT_TARGET': '10.13',
          'OTHER_CFLAGS': [
            '-std=c99',
            '-arch x86_64',
            '-arch arm64'
          ],
          'OTHER_CPLUSPLUSFLAGS': [
            '-std=c++17'
            '-arch x86_64',
            '-arch arm64'
          ],
          'OTHER_LDFLAGS': [
            '-arch x86_64',
            '-arch arm64'
          ]
        }
      }]
    ]
  }]
}
