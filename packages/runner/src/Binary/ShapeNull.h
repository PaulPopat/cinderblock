#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeNull : public Shape {
  public:
  const static char TypeName = 7;
  ShapeNull(const char* binary, int offset);
  ~ShapeNull();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
