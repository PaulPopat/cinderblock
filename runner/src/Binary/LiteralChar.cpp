#include "LiteralChar.h"
#include "../Storage/VariablePrimitiveChar.h"

namespace Binary
{
  LiteralChar::LiteralChar(char *binary, int offset)
  {
    this->value = binary[offset];
    this->end = offset + 1;
  }

  const int LiteralChar::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralChar::resolve(Closure *closure) const
  {
    return new VariablePrimitiveChar(this->value);
  }
}