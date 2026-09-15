#pragma once

#include "LiteralString.h"
#include "Shape.h"
#include <vector>

namespace Binary {
struct ShapeTuplePart {
  const LiteralString* name;
  const Shape* value;
};

class ShapeTuple : public Shape {
  public:
  const static char TypeName = 10;
  ShapeTuple(const char* binary, int offset);
  ~ShapeTuple();

  const int get_end() const;
  const bool matches(const Variable* subject) const;

  private:
  std::vector<ShapeTuplePart> values;
  int end;
};
}
