#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeInt : public Shape {
  public:
  const static char TypeName = 5;
  ShapeInt(const char* binary, int offset);
  ~ShapeInt();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
