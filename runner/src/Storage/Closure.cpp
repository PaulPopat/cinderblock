#include "./Closure.h"

namespace Storage
{
  Closure::Closure(Frame *globals, Core::List<Frame *> frames)
  {
    this->globals = globals;
    this->frames = frames;
  }

  Variable *Closure::search(char *name)
  {
    for (const auto &frame : this->frames)
    {
      auto possible = frame->search(name);
      if (possible != nullptr)
      {
        return possible;
      }
    }

    throw "Variable not resolved";
  }

  Closure *Closure::with_frame(Frame *frame)
  {
    auto input = Core::List<Frame *>();
    for (const auto &frame : this->frames)
    {
      input.push(frame);
    }

    input.push(frame);

    return new Closure(this->globals, input);
  }

  Closure *Closure::add_variable(char *name, Variable *value)
  {
    auto frame = *this->frames.end();
    frame->add_variable(name, value);
    return this;
  }

  Variable *Closure::search_global(char *name)
  {
    auto possible = this->globals->search(name);
    if (possible != nullptr)
    {
      return possible;
    }

    throw "Global not resolved";
  }
}