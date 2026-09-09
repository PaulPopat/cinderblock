#pragma once

#include <vector>
#include <emscripten/val.h>

using namespace emscripten;

namespace Storage
{
  class Variable
  {
  public:
    static Variable *Parse(val value);
    static void Register(char identifier, Variable *init(char *binary, int offset));
    static void Cleanup();

    Variable();
    virtual const val raw() const = 0;
    const char TypeName = 0;

  private:
    static std::vector<Variable *> variables;
  };
}
