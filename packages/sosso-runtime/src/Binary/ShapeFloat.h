#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeFloat : public Shape {
  public:
  const static char TypeName = 4;
  ShapeFloat(const char* binary, int offset);
  ~ShapeFloat();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
