#include "./Ternary.h"

namespace Binary
{
  Ternary::Ternary(char *binary, int offset)
  {
    this->predicate = Instruction::Parse(binary, offset);
    this->positive = Instruction::Parse(binary, this->predicate->get_end());
    this->negative = Instruction::Parse(binary, this->positive->get_end());
    this->end = this->negative->get_end();
  }

  Ternary::~Ternary()
  {
    delete this->predicate;
    delete this->positive;
    delete this->negative;
  }

  const int Ternary::get_end() const
  {
    return this->end;
  }
}