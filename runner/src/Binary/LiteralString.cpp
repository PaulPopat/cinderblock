#include "./LiteralString.h"

namespace Binary
{
  LiteralString::LiteralString(char *binary, int offset) : binary(binary), offset(offset)
  {
    int end = offset;
    // 3 is end of text according to the ascii standard so we use that when encoding strings
    while (binary[end] != 3)
    {
      end += 1;
    }

    this->end = end + 2;
  }

  const int LiteralString::get_end() const
  {
    return this->end;
  }
}