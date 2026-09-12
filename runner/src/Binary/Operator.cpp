#include "Operator.h"
#include "../Storage/VariablePipeable.h"
#include "../Storage/VariablePrimitive.h"
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
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveString::TypeName: {
      if (right->get_type_name() != VariablePrimitiveString::TypeName) {
        throw "Invalid maths";
      }
      auto result = VariablePrimitiveString::FromVariable(left)->get_value();
      return closure->add_temp_variable(new VariablePrimitiveString(result.append(VariablePrimitiveString::FromVariable(right)->get_value())));
    }
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() + VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() + VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() + VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() + VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() + VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::And: {
    auto left = this->left->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveBool::TypeName: {
      if (!VariablePrimitiveBool::FromVariable(left)->get_value()) {
        return closure->add_temp_variable(new VariablePrimitiveBool(false));
      }

      auto right = this->right->resolve(closure);
      return closure->add_temp_variable(new VariablePrimitiveBool(VariablePrimitiveBool::FromVariable(right)->get_value()));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::Divide: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() / VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() / VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() / VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() / VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() / VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::Equals: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveString::TypeName: {
      if (right->get_type_name() != VariablePrimitiveString::TypeName) {
        throw "Invalid maths";
      }
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveString::FromVariable(left)->get_value().compare(
          VariablePrimitiveString::FromVariable(right)->get_value()
        )
        == 0
      ));
    }
    case VariablePrimitiveNull::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(left->get_type_name() == right->get_type_name()));
    }
    case VariablePrimitiveBool::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveBool::FromVariable(left)->get_value() == VariablePrimitive<bool>::GetValue(right)
      ));
    }
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveChar::FromVariable(left)->get_value() == VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveDouble::FromVariable(left)->get_value() == VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveFloat::FromVariable(left)->get_value() == VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveInt::FromVariable(left)->get_value() == VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveLong::FromVariable(left)->get_value() == VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::GreaterThan: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() > VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() > VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() > VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() > VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() > VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::GreaterThanOrEqualTo: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() >= VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() >= VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() >= VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() >= VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() >= VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::In: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    if (left->get_type_name() != VariablePrimitiveString::TypeName) {
      throw "Invalid maths";
    }

    if (right->get_type_name() != VariableTuple::TypeName) {
      throw "Invalid maths";
    }

    return closure->add_temp_variable(new VariablePrimitiveBool(
      VariableTuple::FromVariable(right)
        ->get(VariablePrimitiveString::FromVariable(left)->get_value())
        ->get_type_name()
      != VariablePrimitiveNull::TypeName
    ));
  }
  case OperatorType::LessThan: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() < VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() < VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() < VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() < VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() < VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::LessThanOrEqualTo: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() <= VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() <= VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() <= VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() <= VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() <= VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::Multiply: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() * VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() * VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() * VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() * VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() * VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::NotEquals: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveString::TypeName: {
      if (right->get_type_name() != VariablePrimitiveString::TypeName) {
        throw "Invalid maths";
      }
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveString::FromVariable(left)->get_value().compare(
          VariablePrimitiveString::FromVariable(right)->get_value()
        )
        != 0
      ));
    }
    case VariablePrimitiveNull::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(left->get_type_name() != right->get_type_name()));
    }
    case VariablePrimitiveBool::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveBool::FromVariable(left)->get_value() != VariablePrimitive<bool>::GetValue(right)
      ));
    }
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveChar::FromVariable(left)->get_value() != VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveDouble::FromVariable(left)->get_value() != VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveFloat::FromVariable(left)->get_value() != VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveInt::FromVariable(left)->get_value() != VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveBool(
        VariablePrimitiveLong::FromVariable(left)->get_value() != VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::Or: {
    auto left = this->left->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveBool::TypeName: {
      if (VariablePrimitiveBool::FromVariable(left)->get_value()) {
        return closure->add_temp_variable(new VariablePrimitiveBool(true));
      }

      auto right = this->right->resolve(closure);
      return closure->add_temp_variable(new VariablePrimitiveBool(VariablePrimitiveBool::FromVariable(right)->get_value()));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::PartialPipe: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);

    if (left->get_type_name() != VariableTuple::TypeName) {
      throw "Invalid maths";
    }

    if (right->get_type_name() != VariablePipeable::TypeName) {
      throw "Invalid maths";
    }

    return closure->add_temp_variable(new VariablePipeable(
      [left, right, closure](const VariableTuple* args) {
        return VariablePipeable::FromVariable(right)->invoke(
          VariableTuple::FromVariable(
            VariableTuple::FromVariable(left)->merge(args)
          )
        );
      },
      false
    ));
  }
  case OperatorType::Pipe: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);

    if (left->get_type_name() != VariableTuple::TypeName) {
      auto input = std::vector<VariableTuplePart>();
      input.push_back({ std::string("_s"), left });
      left = closure->add_temp_variable(new VariableTuple(input));
    }

    if (right->get_type_name() != VariablePipeable::TypeName) {
      throw "Invalid maths";
    }

    return VariablePipeable::FromVariable(right)->invoke(
      VariableTuple::FromVariable(
        VariableTuple::FromVariable(left)
      )
    );
  }
  case OperatorType::Subtract: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() - VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveDouble::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveDouble(
        VariablePrimitiveDouble::FromVariable(left)->get_value() - VariablePrimitive<double>::GetValue(right)
      ));
    }
    case VariablePrimitiveFloat::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveFloat(
        VariablePrimitiveFloat::FromVariable(left)->get_value() - VariablePrimitive<float>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() - VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() - VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  case OperatorType::Modulo: {
    auto left = this->left->resolve(closure);
    auto right = this->right->resolve(closure);
    switch (left->get_type_name()) {
    case VariablePrimitiveChar::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveChar(
        VariablePrimitiveChar::FromVariable(left)->get_value() % VariablePrimitive<char>::GetValue(right)
      ));
    }
    case VariablePrimitiveInt::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveInt(
        VariablePrimitiveInt::FromVariable(left)->get_value() % VariablePrimitive<int>::GetValue(right)
      ));
    }
    case VariablePrimitiveLong::TypeName: {
      return closure->add_temp_variable(new VariablePrimitiveLong(
        VariablePrimitiveLong::FromVariable(left)->get_value() % VariablePrimitive<long>::GetValue(right)
      ));
    }
    default: {
      throw "Invalid maths";
    }
    }
  }
  default: {
    throw "Unknown operation";
  }
  }
}
}
