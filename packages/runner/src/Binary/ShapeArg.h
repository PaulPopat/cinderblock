#pragma once

#include "LiteralString.h"
#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeArg : public Shape {
  public:
  ShapeArg(const char* binary, int offset);
  ~ShapeArg();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  const LiteralString* name;
  const Shape* type;
  int end;
};
}
