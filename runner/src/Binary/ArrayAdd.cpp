#include "ArrayAdd.h"
#include "../Storage/VariableArray.h"

namespace Binary {
ArrayAdd::ArrayAdd(char* binary, int offset)
{
  this->left = Instruction::Parse(binary, offset);
  this->right = Instruction::Parse(binary, this->left->get_end());
  this->end = this->right->get_end();
}

ArrayAdd::~ArrayAdd()
{
  delete this->left;
  delete this->right;
}

const int ArrayAdd::get_end() const
{
  return this->end;
}

const Variable* ArrayAdd::resolve(Closure* closure) const
{
  auto raw_left = this->left->resolve(closure);
  auto raw_right = this->right->resolve(closure);

  auto result = std::vector<const Variable*>();
  if (raw_left->IsType == VariableArray::TypeName) {
    for (auto var : VariableArray::FromVariable(raw_left)->get_values()) {
      result.push_back(var);
    }
  } else {
    result.push_back(raw_left);
  }

  if (raw_right->IsType == VariableArray::TypeName) {
    for (auto var : VariableArray::FromVariable(raw_right)->get_values()) {
      result.push_back(var);
    }
  } else {
    result.push_back(raw_right);
  }

  return closure->add_temp_variable(new VariableArray(result));
}
}
