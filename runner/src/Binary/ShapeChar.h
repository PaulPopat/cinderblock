#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeChar : public Shape {
  public:
  const static char TypeName = 2;
  ShapeChar(const char* binary, int offset);
  ~ShapeChar();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
