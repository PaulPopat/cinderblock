#include "LiteralLong.h"
#include "extract.h"
#include "../Storage/VariablePrimitiveLong.h"

namespace Binary
{
  LiteralLong::LiteralLong(char *binary, int offset)
  {
    this->end = offset + sizeof(long);
    this->value = (long *)extract(binary, offset, sizeof(long));
  }

  LiteralLong::~LiteralLong()
  {
    delete this->value;
  }

  const int LiteralLong::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralLong::resolve(Closure *closure) const
  {
    return new VariablePrimitiveLong(*this->value);
  }
}