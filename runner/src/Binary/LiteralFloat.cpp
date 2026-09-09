#include "LiteralFloat.h"
#include "extract.h"
#include "../Storage/VariablePrimitiveFloat.h"

namespace Binary
{
  LiteralFloat::LiteralFloat(char *binary, int offset)
  {
    this->end = offset + sizeof(float);
    this->value = (float *)extract(binary, offset, sizeof(float));
  }

  LiteralFloat::~LiteralFloat()
  {
    this->value = value;
  }

  const int LiteralFloat::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralFloat::resolve(Closure *closure) const
  {
    return new VariablePrimitiveFloat(*this->value);
  }
}