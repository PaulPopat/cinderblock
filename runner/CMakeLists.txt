cmake_minimum_required (VERSION 3.6)

set_property (GLOBAL PROPERTY USE_FOLDERS ON)

set (CMAKE_SUPPRESS_REGENERATION 1)
set (CMAKE_CONFIGURATION_TYPES Debug;Release;RelWithDebInfo)
set (CMAKE_DEBUG_POSTFIX "Debug")

add_definitions (-DUNICODE -D_UNICODE)

project (CinderBlock)
file(GLOB
  CinderBlockRunnerSourceMain
  "src/main.cpp"
)

file(GLOB
  CinderBlockRunnerSourceFiles
  "src/**/*.h"
  "src/**/*.cpp"
)

set (
	CinderBlockRunnerFiles
  ${CinderBlockRunnerSourceMain}
	${CinderBlockRunnerSourceFiles}
)

add_executable (CinderBlockRunner ${CinderBlockRunnerFiles})

if(EMSCRIPTEN)
  set_target_properties(CinderBlockRunner PROPERTIES
    OUTPUT_NAME "CinderBlockRunner"
    SUFFIX ".js"
  )
  
  target_compile_options(CinderBlockRunner PRIVATE
    "SHELL:-g"
    "SHELL:-gsource-map"
  )
  
  target_link_options(CinderBlockRunner PRIVATE
    "SHELL:-g"
    "SHELL:-gsource-map"
    "SHELL:-s WASM=1"
    "SHELL:-l embind"
    "SHELL:-s ALLOW_MEMORY_GROWTH=1"
    "SHELL:-s NO_DISABLE_EXCEPTION_CATCHING=1"
    "SHELL:-s MODULARIZE=1"
    "SHELL:-s EXPORT_ES6=1"
    "SHELL:-s STACK_SIZE=262144"
    "SHELL:-s JSPI=1"
    "SHELL:-s JSPI_EXPORTS=Run"
    "SHELL:--bind"
    "SHELL:--emit-tsd CinderBlockRunner.d.ts"
  )
  target_include_directories(CinderBlockRunner PRIVATE "$ENV{EMSDK_DIR}/upstream/emscripten/system/include")
endif()