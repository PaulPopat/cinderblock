#include "LiteralNull.h"
#include "extract.h"
#include "../Storage/VariablePrimitiveNull.h"

namespace Binary
{
  LiteralNull::LiteralNull(char *binary, int offset)
  {
    this->end = offset;
  }

  const int LiteralNull::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralNull::resolve(Closure *closure) const
  {
    return new VariablePrimitiveNull();
  }
}