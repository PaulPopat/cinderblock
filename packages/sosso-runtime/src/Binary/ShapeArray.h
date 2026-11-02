#pragma once

#include "Instruction.h"
#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeArray : public Shape {
  public:
  const static char TypeName = 0;
  ShapeArray(const char* binary, int offset);
  ~ShapeArray();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  const Shape* value;
  int end;
};
}
