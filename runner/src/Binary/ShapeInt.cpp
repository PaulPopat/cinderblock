#include "ShapeInt.h"
#include "../Storage/VariablePrimitiveInt.h"

namespace Binary {
ShapeInt::ShapeInt(const char* binary, int offset)
{
  this->end = offset;
}

ShapeInt::~ShapeInt()
{
}

const int ShapeInt::get_end() const
{
  return this->end;
}

const bool ShapeInt::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveInt::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
