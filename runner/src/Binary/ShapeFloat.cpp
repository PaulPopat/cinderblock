#include "ShapeFloat.h"
#include "../Storage/VariablePrimitiveFloat.h"

namespace Binary {
ShapeFloat::ShapeFloat(const char* binary, int offset)
{
  this->end = offset;
}

ShapeFloat::~ShapeFloat()
{
}

const int ShapeFloat::get_end() const
{
  return this->end;
}

const bool ShapeFloat::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveFloat::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
