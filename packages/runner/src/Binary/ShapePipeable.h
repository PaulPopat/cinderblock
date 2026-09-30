#pragma once

#include "Instruction.h"
#include "Shape.h"
#include <vector>

namespace Binary {
class ShapePipeable : public Shape {
  public:
  const static char TypeName = 8;
  ShapePipeable(const char* binary, int offset);
  ~ShapePipeable();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
