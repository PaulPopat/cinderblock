#include "./ArrayAdd.h"

namespace Binary
{
  ArrayAdd::ArrayAdd(char *binary, int offset)
  {
    this->left = Instruction::Parse(binary, offset);
    this->right = Instruction::Parse(binary, this->left->get_end());
    this->end = this->right->get_end();
  }

  const int ArrayAdd::get_end() const
  {
    return this->end;
  }
}