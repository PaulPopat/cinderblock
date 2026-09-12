#include "Binary/App.h"
#include "Storage/Closure.h"
#include "Storage/Frame.h"
#include "Storage/Variable.h"
#include "Storage/VariableArray.h"
#include "Storage/VariablePipeable.h"
#include "Storage/VariablePrimitive.h"
#include "Storage/VariablePrimitiveBool.h"
#include "Storage/VariablePrimitiveChar.h"
#include "Storage/VariablePrimitiveDouble.h"
#include "Storage/VariablePrimitiveFloat.h"
#include "Storage/VariablePrimitiveInt.h"
#include "Storage/VariablePrimitiveLong.h"
#include "Storage/VariablePrimitiveNull.h"
#include "Storage/VariablePrimitiveString.h"
#include "Storage/VariableTuple.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>

using namespace emscripten;

EMSCRIPTEN_DECLARE_VAL_TYPE(CinderBlockVal);
EMSCRIPTEN_DECLARE_VAL_TYPE(CinderBlockFrame);
EMSCRIPTEN_DECLARE_VAL_TYPE(CinderBlockTuple);

Binary::App* app;
Storage::Frame* globals;

void LoadApp(std::string buf)
{
  app = new Binary::App(buf.data());
  Variable::Register(VariableArray::TypeName, [](val value) {
    return new VariableArray(value);
  });
  Variable::Register(VariablePipeable::TypeName, [](val value) {
    return new VariablePipeable(value);
  });
  Variable::Register(VariablePrimitiveBool::TypeName, [](val value) {
    return new VariablePrimitiveBool(value);
  });
  Variable::Register(VariablePrimitiveChar::TypeName, [](val value) {
    return new VariablePrimitiveChar(value);
  });
  Variable::Register(VariablePrimitiveDouble::TypeName, [](val value) {
    return new VariablePrimitiveDouble(value);
  });
  Variable::Register(VariablePrimitiveFloat::TypeName, [](val value) {
    return new VariablePrimitiveFloat(value);
  });
  Variable::Register(VariablePrimitiveInt::TypeName, [](val value) {
    return new VariablePrimitiveInt(value);
  });
  Variable::Register(VariablePrimitiveLong::TypeName, [](val value) {
    return new VariablePrimitiveLong(value);
  });
  Variable::Register(VariablePrimitiveNull::TypeName, [](val value) {
    return new VariablePrimitiveNull(value);
  });
  Variable::Register(VariablePrimitiveString::TypeName, [](val value) {
    return new VariablePrimitiveString(value);
  });
  Variable::Register(VariableTuple::TypeName, [](val value) {
    return new VariableTuple(value);
  });
}

void LoadGlobals(CinderBlockFrame subject)
{
  globals = Storage::Frame::From(subject);
}

CinderBlockVal Run(std::string name, CinderBlockTuple args)
{
  auto func = app->find(name);
  auto frames = std::vector<Storage::Frame*>();
  auto frame = new Frame();
  frames.push_back(frame);
  auto closure = new Storage::Closure(globals, frames);

  for (const auto& func : app->get_functions()) {
    frame->add_variable(
      func->get_name(),
      new VariablePipeable(
        [closure, func](const VariableTuple* inner_args) {
          return func->exec(closure, inner_args);
        },
        func->get_no_args()
      )
    );
  }

  auto var = func->exec(closure, new VariableTuple(args["data"]));

  auto result = var->raw();
  return (CinderBlockVal)result;
}

EMSCRIPTEN_BINDINGS(my_module)
{
  function("Run", &Run);
  function("LoadGlobals", &LoadGlobals);
  function("LoadApp", &LoadApp);

  register_type<CinderBlockVal>("{ type: number, data: any }");
  register_type<CinderBlockFrame>("Array<{ name: string, value: any }>");
  register_type<CinderBlockTuple>("{ type: 10, data: Array<any> }");
}
