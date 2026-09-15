#include "ShapeNull.h"
#include "../Storage/VariablePrimitiveNull.h"

namespace Binary {
ShapeNull::ShapeNull(const char* binary, int offset)
{
  this->end = offset;
}

ShapeNull::~ShapeNull()
{
}

const int ShapeNull::get_end() const
{
  return this->end;
}

const bool ShapeNull::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveNull::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
