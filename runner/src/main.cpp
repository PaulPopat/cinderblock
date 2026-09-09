#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include "Binary/App.h"
#include "Storage/Frame.h"
#include "Storage/Closure.h"
#include "Storage/Variable.h"

using namespace emscripten;

Binary::App *app;
Storage::Frame *globals;

extern "C"
{
  void LoadApp(char *buf)
  {
    app = new Binary::App(buf);
  }
}

void LoadGlobals(val subject)
{
  globals = Storage::Frame::From(subject);
}

val Run(std::string name, val args)
{
  auto frame = Storage::Frame::From(args);
  auto func = app->find(name);
  auto frames = std::vector<Storage::Frame *>();
  frames.push_back(frame);
  auto closure = new Storage::Closure(globals, frames);
  auto var = func->exec(closure);

  auto result = var->raw();
  delete frame;
  delete closure;
  Storage::Variable::Cleanup();
  return result;
}