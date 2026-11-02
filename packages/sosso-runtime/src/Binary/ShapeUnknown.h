#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeUnknown : public Shape {
  public:
  const static char TypeName = 11;
  ShapeUnknown(const char* binary, int offset);
  ~ShapeUnknown();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
