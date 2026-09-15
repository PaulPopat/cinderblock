#include "Is.h"
#include "../Storage/VariablePrimitiveBool.h"

namespace Binary {
Is::Is(const char* binary, int offset)
{
  this->left = Instruction::Parse(binary, offset);
  this->right = Shape::Parse(binary, this->left->get_end());
  this->end = this->right->get_end();
}

Is::~Is()
{
  delete this->left;
  delete this->right;
}

const int Is::get_end() const
{
  return this->end;
}

const Variable* Is::resolve(Closure* closure) const
{
  auto matches = this->right->matches(this->left->resolve(closure));
  return closure->add_temp_variable(
    new VariablePrimitiveBool(matches)
  );
}
}
