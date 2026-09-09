#include "LiteralInt.h"
#include "extract.h"
#include "../Storage/VariablePrimitiveInt.h"

namespace Binary
{
  LiteralInt::LiteralInt(char *binary, int offset)
  {
    this->end = offset + sizeof(int);
    this->value = (int *)extract(binary, offset, sizeof(int));
  }

  LiteralInt::~LiteralInt()
  {
    delete this->value;
  }

  const int LiteralInt::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralInt::resolve(Closure *closure) const
  {
    return new VariablePrimitiveInt(*this->value);
  }
}