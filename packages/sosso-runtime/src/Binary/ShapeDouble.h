#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeDouble : public Shape {
  public:
  const static char TypeName = 3;
  ShapeDouble(const char* binary, int offset);
  ~ShapeDouble();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
