#pragma once

#include "Shape.h"
#include <vector>

namespace Binary {
class ShapeLong : public Shape {
  public:
  const static char TypeName = 6;
  ShapeLong(const char* binary, int offset);
  ~ShapeLong();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  int end;
};
}
