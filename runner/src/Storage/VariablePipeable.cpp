#include "VariablePipeable.h"
#include <emscripten.h>
#include <emscripten/em_js.h>

namespace Storage
{
  VariablePipeable::VariablePipeable(Variable *(*implementation)(Frame *args), bool no_args)
  {
    this->implementation = implementation;
    this->no_args = no_args;
  }

  VariablePipeable::VariablePipeable(val value)
  {
    this->no_args = false;
    this->implementation = [value](Frame *args)
    {
      return Variable::Parse(value(args->raw()));
    };
  }

  const val VariablePipeable::raw() const
  {
    throw "Cannot return functions to JavaScript";
  }
}