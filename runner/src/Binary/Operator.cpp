#include "Operator.h"
#include "../Storage/VariablePrimitive.h"
#include "../Storage/VariablePrimitiveBool.h"
#include "../Storage/VariablePrimitiveChar.h"
#include "../Storage/VariablePrimitiveDouble.h"
#include "../Storage/VariablePrimitiveFloat.h"
#include "../Storage/VariablePrimitiveInt.h"
#include "../Storage/VariablePrimitiveLong.h"
#include "../Storage/VariablePrimitiveString.h"
#include "../Storage/VariablePrimitiveNull.h"
#include "../Storage/VariableTuple.h"
#include "../Storage/VariablePipeable.h"

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

  const Variable *Operator::resolve(Closure *closure) const
  {
    switch (this->type)
    {
    case OperatorType::Add:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveString::TypeName:
      {
        if (right->TypeName != VariablePrimitiveString::TypeName)
        {
          throw "Invalid maths";
        }
        auto result = VariablePrimitiveString::FromVariable(left)->get_value();
        return new VariablePrimitiveString(result.append(VariablePrimitiveString::FromVariable(right)->get_value()));
      }
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() +
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() +
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() +
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() +
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() +
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::And:
    {
      auto left = this->left->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveBool::TypeName:
      {
        if (!VariablePrimitiveBool::FromVariable(left)->get_value())
        {
          return new VariablePrimitiveBool(false);
        }

        auto right = this->right->resolve(closure);
        return new VariablePrimitiveBool(VariablePrimitiveBool::FromVariable(right)->get_value());
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::Divide:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() /
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() /
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() /
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() /
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() /
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::Equals:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveString::TypeName:
      {
        if (right->TypeName != VariablePrimitiveString::TypeName)
        {
          throw "Invalid maths";
        }
        return new VariablePrimitiveBool(
            VariablePrimitiveString::FromVariable(left)->get_value().compare(
                VariablePrimitiveString::FromVariable(right)->get_value()));
      }
      case VariablePrimitiveNull::TypeName:
      {
        return new VariablePrimitiveBool(left->TypeName == right->TypeName);
      }
      case VariablePrimitiveBool::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveBool::FromVariable(left)->get_value() ==
            VariablePrimitive<bool>::GetValue(right));
      }
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveChar::FromVariable(left)->get_value() ==
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveDouble::FromVariable(left)->get_value() ==
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveFloat::FromVariable(left)->get_value() ==
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveInt::FromVariable(left)->get_value() ==
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveLong::FromVariable(left)->get_value() ==
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::GreaterThan:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() >
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() >
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() >
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() >
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() >
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::GreaterThanOrEqualTo:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() >=
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() >=
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() >=
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() >=
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() >=
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::In:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      if (left->TypeName != VariablePrimitiveString::TypeName)
      {
        throw "Invalid maths";
      }

      if (right->TypeName != VariableTuple::TypeName)
      {
        throw "Invalid maths";
      }

      return new VariablePrimitiveBool(
          VariableTuple::FromVariable(right)
              ->get(VariablePrimitiveString::FromVariable(left)->get_value())
              ->TypeName != VariablePrimitiveNull::TypeName);
    }
    case OperatorType::LessThan:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() <
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() <
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() <
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() <
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() <
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::LessThanOrEqualTo:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() <=
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() <=
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() <=
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() <=
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() <=
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::Multiply:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() *
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() *
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() *
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() *
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() *
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::NotEquals:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveString::TypeName:
      {
        if (right->TypeName != VariablePrimitiveString::TypeName)
        {
          throw "Invalid maths";
        }
        return new VariablePrimitiveBool(
            !VariablePrimitiveString::FromVariable(left)->get_value().compare(
                VariablePrimitiveString::FromVariable(right)->get_value()));
      }
      case VariablePrimitiveNull::TypeName:
      {
        return new VariablePrimitiveBool(left->TypeName != right->TypeName);
      }
      case VariablePrimitiveBool::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveBool::FromVariable(left)->get_value() !=
            VariablePrimitive<bool>::GetValue(right));
      }
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveChar::FromVariable(left)->get_value() !=
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveDouble::FromVariable(left)->get_value() !=
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveFloat::FromVariable(left)->get_value() !=
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveInt::FromVariable(left)->get_value() !=
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveBool(
            VariablePrimitiveLong::FromVariable(left)->get_value() !=
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::Or:
    {
      auto left = this->left->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveBool::TypeName:
      {
        if (VariablePrimitiveBool::FromVariable(left)->get_value())
        {
          return new VariablePrimitiveBool(true);
        }

        auto right = this->right->resolve(closure);
        return new VariablePrimitiveBool(VariablePrimitiveBool::FromVariable(right)->get_value());
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::PartialPipe:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);

      if (left->TypeName != VariableTuple::TypeName)
      {
        throw "Invalid maths";
      }

      if (left->TypeName != VariablePipeable::TypeName)
      {
        throw "Invalid maths";
      }

      return new VariablePipeable([left, right](const VariableTuple *args)
                                  { return VariablePipeable::FromVariable(right)->invoke(
                                        VariableTuple::FromVariable(
                                            VariableTuple::FromVariable(left)->merge(args))); },
                                  false);
    }
    case OperatorType::Pipe:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);

      if (left->TypeName != VariableTuple::TypeName)
      {
        throw "Invalid maths";
      }

      if (left->TypeName != VariablePipeable::TypeName)
      {
        throw "Invalid maths";
      }

      return VariablePipeable::FromVariable(right)->invoke(
          VariableTuple::FromVariable(
              VariableTuple::FromVariable(left)));
    }
    case OperatorType::Subtract:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() -
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveDouble::TypeName:
      {
        return new VariablePrimitiveDouble(
            VariablePrimitiveDouble::FromVariable(left)->get_value() -
            VariablePrimitive<double>::GetValue(right));
      }
      case VariablePrimitiveFloat::TypeName:
      {
        return new VariablePrimitiveFloat(
            VariablePrimitiveFloat::FromVariable(left)->get_value() -
            VariablePrimitive<float>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() -
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() -
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    case OperatorType::Modulo:
    {
      auto left = this->left->resolve(closure);
      auto right = this->right->resolve(closure);
      switch (left->TypeName)
      {
      case VariablePrimitiveChar::TypeName:
      {
        return new VariablePrimitiveChar(
            VariablePrimitiveChar::FromVariable(left)->get_value() %
            VariablePrimitive<char>::GetValue(right));
      }
      case VariablePrimitiveInt::TypeName:
      {
        return new VariablePrimitiveInt(
            VariablePrimitiveInt::FromVariable(left)->get_value() %
            VariablePrimitive<int>::GetValue(right));
      }
      case VariablePrimitiveLong::TypeName:
      {
        return new VariablePrimitiveLong(
            VariablePrimitiveLong::FromVariable(left)->get_value() %
            VariablePrimitive<long>::GetValue(right));
      }
      default:
      {
        throw "Invalid maths";
      }
      }
    }
    default:
    {
      throw "Unknown operation";
    }
    }
  }
}