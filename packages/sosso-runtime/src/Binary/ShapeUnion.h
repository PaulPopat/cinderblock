#pragma once

#include "LiteralString.h"
#include "Shape.h"
#include <vector>

namespace Binary {

class ShapeUnion : public Shape {
  public:
  const static char TypeName = 12;
  ShapeUnion(const char* binary, int offset);
  ~ShapeUnion();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  std::vector<const Shape*> possible;
  int end;
};
}
