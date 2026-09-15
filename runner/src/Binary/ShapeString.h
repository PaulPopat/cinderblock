#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeString : public Shape {
  public:
  const static char TypeName = 9;
  ShapeString(const char* binary, int offset);
  ~ShapeString();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
