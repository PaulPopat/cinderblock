#include "./Operator.h"

namespace Binary
{
  Operator::Operator(char *binary, int offset)
  {
    this->type = (OperatorType)binary[offset];
    this->left = Instruction::Parse(binary, offset + 1);
    this->right = Instruction::Parse(binary, this->left->get_end());
    this->end = this->right->get_end();
  }

  Operator::~Operator()
  {
    delete this->left;
    delete this->right;
  }

  const int Operator::get_end() const
  {
    return this->end;
  }
}