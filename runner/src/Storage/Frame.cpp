#include "Frame.h"
#include <string>

namespace Storage
{
  Frame *Frame::From(val data)
  {
    auto result = new Frame();
    for (const auto &pair : vecFromJSArray<val>(data))
    {
      result->add_variable(pair["name"].as<std::string>(), Variable::Parse(pair["value"]));
    }

    return result;
  }

  Frame::Frame()
  {
    this->data = std::vector<VariableTuplePart>();
  }

  Frame::~Frame()
  {
  }

  Variable *Frame::search(std::string name)
  {
    for (const auto &variable : this->data)
    {
      if (variable.name.compare(name))
      {
        return variable.value;
      }
    }

    return nullptr;
  }

  Frame *Frame::add_variable(std::string name, Variable *value)
  {
    this->data.push_back({name, value});
    return this;
  }

  Frame *Frame::merge(const Frame *input)
  {
    for (const auto &variable : input->data)
    {
      this->add_variable(variable.name, variable.value);
    }

    return this;
  }

  const val Frame::raw() const
  {
    auto result = val::object();

    for (const auto &part : this->data)
    {
      result.set(part.name, part.value->raw());
    }

    return result;
  }
}