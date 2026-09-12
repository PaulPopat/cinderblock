#pragma once

#include <emscripten/val.h>
#include <functional>
#include <vector>

using namespace emscripten;

namespace Storage {
class Variable {
  public:
  static Variable* Parse(val value);
  static void Register(char identifier, std::function<Variable*(val data)> init);

  virtual ~Variable() { }
  virtual const char get_type_name() const = 0;
  virtual const val raw() const = 0;
};
}
