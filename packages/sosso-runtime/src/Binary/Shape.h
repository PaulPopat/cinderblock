#pragma once

#include "../Storage/Variable.h"
#include <functional>

using namespace Storage;

namespace Binary {
class Shape {
  public:
  static Shape* Parse(const char* binary, int offset);
  static void Register(char identifier, std::function<Shape*(const char* binary, int offset)> init);
  virtual ~Shape() { }

  virtual const int get_end() const = 0;
  virtual const bool matches(const Variable* subject) const = 0;
};
}
