#include "VariablePipeable.h"
#include <emscripten.h>
#include <emscripten/em_js.h>

namespace Storage {
VariablePipeable::VariablePipeable(std::function<const Variable*(const VariableTuple*)> implementation, bool no_args)
{
  this->implementation = implementation;
  this->no_args = no_args;
}

VariablePipeable::VariablePipeable(val value)
{
  this->no_args = false;
  this->implementation = [value](const VariableTuple* args) {
    return Variable::Parse(value(args->raw()));
  };
}

const val VariablePipeable::raw() const
{
  throw "Cannot return functions to JavaScript";
}

const Variable* VariablePipeable::invoke(const VariableTuple* args) const
{
  return this->implementation(args);
}
}
