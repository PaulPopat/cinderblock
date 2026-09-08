#include "./Reference.h"

namespace Binary
{
  Reference::Reference(char *binary, int offset)
  {
    this->name = new LiteralString(binary, offset);
    this->end = this->name->get_end();
  }

  const int Reference::get_end() const
  {
    return this->end;
  }
}