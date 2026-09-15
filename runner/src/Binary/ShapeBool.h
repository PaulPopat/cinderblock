#pragma once

#include "Instruction.h"
#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeBool : public Shape {
  public:
  const static char TypeName = 1;
  ShapeBool(const char* binary, int offset);
  ~ShapeBool();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
