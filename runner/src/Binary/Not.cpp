#include "./Not.h"

namespace Binary
{
  Not::Not(char *binary, int offset)
  {
    this->subject = Instruction::Parse(binary, offset);
    this->end = this->subject->get_end();
  }

  Not::~Not()
  {
    delete this->subject;
  }

  const int Not::get_end() const
  {
    return this->end;
  }
}