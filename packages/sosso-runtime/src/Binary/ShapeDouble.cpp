#include "ShapeDouble.h"
#include "../Storage/VariablePrimitiveDouble.h"

namespace Binary {
ShapeDouble::ShapeDouble(const char* binary, int offset)
{
  this->end = offset;
}

ShapeDouble::~ShapeDouble()
{
}

const int ShapeDouble::get_end() const
{
  return this->end;
}

const bool ShapeDouble::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveDouble::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
