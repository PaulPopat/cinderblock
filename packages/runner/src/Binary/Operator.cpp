#include "Operator.h"
#include "../CinderblockException.h"
#include "../Storage/Variable.h"
#include "../Storage/VariablePipeable.h"
#include "../Storage/VariablePrimitiveBool.h"
#include "../Storage/VariablePrimitiveChar.h"
#include "../Storage/VariablePrimitiveDouble.h"
#include "../Storage/VariablePrimitiveFloat.h"
#include "../Storage/VariablePrimitiveInt.h"
#include "../Storage/VariablePrimitiveLong.h"
#include "../Storage/VariablePrimitiveNull.h"
#include "../Storage/VariablePrimitiveString.h"
#include "../Storage/VariableTuple.h"

namespace Binary {
Operator::Operator(const char* binary, int offset)
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

const Variable* Operator::resolve(Closure* closure) const
{
  switch (this->type) {
  case OperatorType::Add: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_add(this->right->resolve(closure)));
  }
  case OperatorType::And: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_and(this->right->resolve(closure)));
  }
  case OperatorType::Divide: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_divide(this->right->resolve(closure)));
  }
  case OperatorType::Equals: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_equals(this->right->resolve(closure)));
  }
  case OperatorType::GreaterThan: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_greater_than(this->right->resolve(closure)));
  }
  case OperatorType::GreaterThanOrEqualTo: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_greater_than_or_equal_to(this->right->resolve(closure)));
  }
  case OperatorType::In: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_in(this->right->resolve(closure)));
  }
  case OperatorType::LessThan: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_less_than(this->right->resolve(closure)));
  }
  case OperatorType::LessThanOrEqualTo: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_less_than_or_equal_to(this->right->resolve(closure)));
  }
  case OperatorType::Multiply: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_multiply(this->right->resolve(closure)));
  }
  case OperatorType::NotEquals: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_not_equals(this->right->resolve(closure)));
  }
  case OperatorType::Or: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_or(this->right->resolve(closure)));
  }
  case OperatorType::Pipe: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_pipe(this->right->resolve(closure)));
  }
  case OperatorType::PartialPipe: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_partial_pipe(this->right->resolve(closure)));
  }
  case OperatorType::Subtract: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_subtract(this->right->resolve(closure)));
  }
  case OperatorType::Modulo: {
    return closure->add_temp_variable(this->left->resolve(closure)->operate_modulo(this->right->resolve(closure)));
  }
  default: {
    throw CinderblockException("Unknown operation");
  }
  }
}
}
