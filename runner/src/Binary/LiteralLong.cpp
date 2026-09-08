#include "./LiteralLong.h"
#include "./extract.h"

namespace Binary
{
  LiteralLong::LiteralLong(char *binary, int offset)
  {
    this->end = offset + sizeof(long);
    this->value = (long *)extract(binary, offset, sizeof(long));
  }

  const int LiteralLong::get_end() const
  {
    return this->end;
  }
}