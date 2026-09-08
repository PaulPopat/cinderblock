#include "./LiteralInt.h"
#include "./extract.h"

namespace Binary
{
  LiteralInt::LiteralInt(char *binary, int offset)
  {
    this->end = offset + sizeof(int);
    this->value = (int *)extract(binary, offset, sizeof(int));
  }

  const int LiteralInt::get_end() const
  {
    return this->end;
  }
}