#include "./Access.h"

namespace Binary
{
  Access::Access(char *binary, int offset)
  {
    this->subject = Instruction::Parse(binary, offset);
    this->key = new LiteralString(binary, this->subject->get_end());
    this->end = this->key->get_end();
  }

  const int Access::get_end() const
  {
    return this->end;
  }
}